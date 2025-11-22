import { useState, useEffect, useCallback } from 'react';
import { engineService } from '../engine/EngineService';

export function useStockfish() {
    const [isReady, setIsReady] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [evaluation, setEvaluation] = useState(null); // { cp, mate, bestMove }
    const [error, setError] = useState(null);

    useEffect(() => {
        // Initialize engine on mount
        engineService.init()
            .then(() => setIsReady(true))
            .catch(err => setError(err));

        return () => {
            // Optional: terminate on unmount if you want to save resources, 
            // but for a SPA we might want to keep it alive.
            // engineService.terminate();
        };
    }, []);

    const evaluatePosition = useCallback(async (fen, depth = 15) => {
        if (!isReady) return;

        setIsSearching(true);
        setError(null);

        try {
            const result = await engineService.evaluate(fen, depth);
            setEvaluation({
                cp: result.eval,
                mate: result.mate,
                bestMove: result.bestMove
            });
            return result;
        } catch (err) {
            // Ignore "New search started" errors as they are expected race condition handling
            if (err.message !== "New search started") {
                console.error("Evaluation error:", err);
                setError(err);
            }
        } finally {
            setIsSearching(false);
        }
    }, [isReady]);

    const stopSearch = useCallback(() => {
        if (engineService.worker) {
            engineService.worker.postMessage("stop");
            setIsSearching(false);
        }
    }, []);

    return {
        isReady,
        isSearching,
        evaluation,
        error,
        evaluatePosition,
        stopSearch
    };
}
