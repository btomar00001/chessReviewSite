const STOCKFISH_PATH = "./stockfish.js";

class EngineService {
    constructor() {
        this.worker = null;
        this.isReady = false;
        this.initializationPromise = null;
        this.currentSearch = null; // { resolve, reject, timeoutId }
    }

    /**
     * Initialize the worker and perform UCI handshake.
     * @param {Object} options - Configuration options
     * @param {string} [options.engineUrl] - URL to the stockfish.js file
     * @returns {Promise<boolean>}
     */
    init(options = {}) {
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        const engineUrl = options.engineUrl || STOCKFISH_PATH;

        this.initializationPromise = new Promise((resolve, reject) => {
            try {
                // If a full URL is provided, use it. Otherwise use relative path.
                // Note: For external URLs, we might need to handle CORS or use a Blob.
                // For this MVP, we assume local or same-origin.
                const workerUrl = engineUrl.startsWith("http")
                    ? engineUrl
                    : new URL(engineUrl, import.meta.url);

                this.worker = new Worker(workerUrl);

                this.worker.onerror = (e) => {
                    console.error("Stockfish Worker Error:", e);
                    reject(e);
                };

                this.worker.onmessage = (e) => {
                    const line = e.data;
                    // console.log("Engine:", line); // Verbose logging

                    if (line === "uciok") {
                        this.worker.postMessage("isready");
                    } else if (line === "readyok") {
                        this.isReady = true;
                        resolve(true);
                    } else {
                        // Handle other messages during init or normal operation
                        this.handleMessage(line);
                    }
                };

                // Start UCI handshake
                this.worker.postMessage("uci");

            } catch (err) {
                console.error("Failed to create Stockfish worker:", err);
                reject(err);
            }
        });

        return this.initializationPromise;
    }

    /**
     * Handle messages from the worker during normal operation.
     */
    handleMessage(line) {
        if (!this.currentSearch) return;

        // Parse evaluation (centipawns)
        // Example: "info depth 10 ... score cp 50 ..."
        if (line.startsWith("info") && line.includes("score cp")) {
            const match = line.match(/score cp (-?\d+)/);
            if (match) {
                this.currentSearch.eval = parseInt(match[1], 10);
            }
        }
        // Parse mate score
        // Example: "info depth 10 ... score mate 2 ..."
        else if (line.startsWith("info") && line.includes("score mate")) {
            const match = line.match(/score mate (-?\d+)/);
            if (match) {
                // Convert mate score to a large number for comparison
                const mateIn = parseInt(match[1], 10);
                this.currentSearch.mate = mateIn;
            }
        }

        // Parse best move
        if (line.startsWith("bestmove")) {
            const parts = line.split(" ");
            const bestMove = parts[1];

            // Resolve the current search
            const result = {
                bestMove,
                eval: this.currentSearch.eval,
                mate: this.currentSearch.mate
            };

            if (this.currentSearch.timeoutId) {
                clearTimeout(this.currentSearch.timeoutId);
            }

            this.currentSearch.resolve(result);
            this.currentSearch = null;
        }
    }

    /**
     * Evaluate a position.
     * @param {string} fen - FEN string
     * @param {number} depth - Search depth (default 15)
     * @returns {Promise<{bestMove: string, eval: number, mate: number}>}
     */
    async evaluate(fen, depth = 15) {
        if (!this.worker) {
            await this.init();
        }

        // If a search is already in progress, stop it (or queue it - for now we just stop/reject)
        if (this.currentSearch) {
            this.worker.postMessage("stop");
            // We could reject the previous one, but usually we just want the latest result.
            // For simplicity in this MVP, let's reject the old one so the UI knows it's stale.
            if (this.currentSearch.reject) {
                this.currentSearch.reject(new Error("New search started"));
            }
            if (this.currentSearch.timeoutId) {
                clearTimeout(this.currentSearch.timeoutId);
            }
        }

        return new Promise((resolve, reject) => {
            this.currentSearch = {
                resolve,
                reject,
                eval: null,
                mate: null,
                timeoutId: setTimeout(() => {
                    if (this.currentSearch === this.currentSearch) { // Check if still same search
                        // If timeout, try to stop and resolve with what we have or reject
                        this.worker.postMessage("stop");
                        reject(new Error("Engine timeout"));
                    }
                }, 10000) // 10s timeout
            };

            this.worker.postMessage(`position fen ${fen}`);
            this.worker.postMessage(`go depth ${depth}`);
        });
    }

    terminate() {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
            this.isReady = false;
            this.initializationPromise = null;
        }
    }
}

// Export singleton instance
export const engineService = new EngineService();
