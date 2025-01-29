import { createRef, useCallback, useEffect, useState } from 'react';
import './Slider.scss';

/**
 * Slider compontent properties
 */
export interface ISliderProps {
    min: number;
    max: number;
    width?: string;
    value?: number;
    step?: number;
    onDrag?: (value: number) => void;
    onDraggingStateChanged?: (value: boolean) => void;
    onValueChanged?: (value: number) => void;
}

/**
 * Slider compontent
 */
function Slider({ min, max, width = '100%', value = 0, step, onDrag, onDraggingStateChanged, onValueChanged }: ISliderProps) {

    // Init state
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);

    // Validate properties
    if (min >= max) { throw new Error('min prop must be less than max'); }
    if (value != null && value != undefined && (value < min || value > max)) { throw new Error('value prop must be between min and max'); }
    if (width.slice(-1) !== '%' && width.slice(-2).toLowerCase() !== 'px') { throw new Error('width prop must be a percentage or px string (ex: "100%" or "100px")'); }
    if (step) {
        if (step <= 0) { throw new Error('step prop must be greater than 0'); }
        if (step < ((max - min) / 100)) { throw new Error('step prop must not be less than 1% of the range'); }
        if (min != 0 && min % step != 0) { throw new Error('step prop must be a multiple of the min prop'); }
        if (max != 0 && max % step != 0) { throw new Error('step prop must be a multiple of the max prop'); }
    }

    // Initialize element references
    const refContainer = createRef<HTMLDivElement>(); // Slider container reference
    const refBar = createRef<HTMLDivElement>(); // Slider bar reference
    const refHandle = createRef<HTMLDivElement>(); // Slider handle/knob element reference

    /*** HELPER FUNCTIONS ***/

    /** Sets the center position of the handle in the bar by px */
    const halfHandleWidth = (): number => refHandle.current!.offsetWidth / 2;
    /** Calculates the width of the bar in px */
    const barWidth = (): number => refBar.current!.offsetWidth;
    /**
     * Sets the width of the slider container
     * 
     * @param newWidth - CSS value (px or %)
     */
    const setContainerWidth = (newWidth: string): void => refContainer.current?.setAttribute('style', `width: ${newWidth}`);
    /** 
     * Sets handle position and filled bar background width
     * 
     * @param px - px value
     */
    const setHandleByPosition = (px: number): void => {
        refHandle.current?.setAttribute('style', `left: ${px - halfHandleWidth()}px`); // Set position of handle
        refBar.current?.setAttribute('style', `--data-filled-width: ${px + halfHandleWidth()}px`); // Set width of filled background color of bar
    }
    /**
     * Updates handle position and filled bar width based on new value
     * 
     * @param newValue - value to set handle to
     */
    const setHandleByValue = (newValue: number): void => {
        const percent = (newValue - min) / (max - min);
        const left = percent * barWidth();
        setHandleByPosition(left);
    }
    /** Get single step in pixels */
    const getStepPx = (): number => step != undefined ? (step / (max - min)) * barWidth() : 0;
    /** 
     * Get current step calculation
     * 
     * @param handlePos - handle's center position in px
     */
    const getCurrentStepByHandlePosition = (handlePos: number): number => step != undefined ? Math.round(handlePos / getStepPx()) : 0;
    /** Calculate slider value output based on handle's position */
    const getValueByHandlePosition = (): number => {
        const handlePos = refHandle.current!.offsetLeft + halfHandleWidth();
        if (step) {
            // Step is set
            return getCurrentStepByHandlePosition(handlePos)! * step + min;
        } else {
            // No step set, calculate based on percentage in bar
            const percent = handlePos / barWidth();
            return percent * (max - min) + min;
        }
    };
    /**
     * Stop event propagation 
     * 
     * @param event - mouse or touch event
     */
    const eventStopPropagation = (event: MouseEvent | TouchEvent): void => {
        event.stopPropagation();
        event.preventDefault();
    };

    /*** DRAG & DROP HANDLERS (MOUSE/TOUCH EVENTS) ***/

    /**
     * Drag stop event (mouse up or touch end)
     * 
     * @param event - mouse or touch event
     */
    const handleDragStop = useCallback((event: MouseEvent | TouchEvent): void => {
        if (!isDragging) return;
        eventStopPropagation(event);
        setIsDragging(false);
        if (onValueChanged) onValueChanged(getValueByHandlePosition());
        if (onDraggingStateChanged) onDraggingStateChanged(false);
    }, [isDragging, onValueChanged, onDraggingStateChanged, getValueByHandlePosition]);

    /** 
     * Drag move event (mouse move or touch move)
     * 
     * @param event - mouse or touch event
     */
    const handleDragMove = useCallback((event: MouseEvent | TouchEvent): void => {
        if (!isDragging) return;
        eventStopPropagation(event);
        const mouseX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        // Calculate center position of handle considering click position offset
        let handlePos = mouseX - dragOffset + halfHandleWidth();
        // Calculate closest step position if step is set
        if (step != undefined) {
            handlePos = getCurrentStepByHandlePosition(handlePos) * getStepPx();
        }
        // Ensure new position is within limits of bar
        const leftLimit = 0;
        const rightLimit = barWidth();
        const newLeftWithinLimits = Math.min(Math.max(handlePos, leftLimit), rightLimit);
        // Set position of handle
        setHandleByPosition(newLeftWithinLimits);
        // Call onDrag event
        if (onDrag) onDrag(getValueByHandlePosition());
    }, [isDragging, dragOffset, refHandle, refBar, getValueByHandlePosition]);

    /** 
     * Drag start event (mouse down or touch start)
     * 
     * @param event - mouse or touch event
     */
    const handleDragStart = (event: React.MouseEvent | React.TouchEvent): void => {
        if (isDragging) return;
        setIsDragging(true);
        const x = 'touches' in event ? event.touches[0].clientX : event.clientX;
        setDragOffset(x - refHandle.current!.offsetLeft);
        if (onDraggingStateChanged) onDraggingStateChanged(true);
    };

    // Update window listeners when dragging state changes.  We use window-level listeners for move/up events to allow user to move their mouse off the handle and still have it work.
    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mouseup', handleDragStop);
            window.addEventListener('touchend', handleDragStop);
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('touchmove', handleDragMove);
        }
        return () => {
            // cleanup
            window.removeEventListener('mouseup', handleDragStop);
            window.removeEventListener('touchend', handleDragStop);
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('touchmove', handleDragMove);
        }
    }, [isDragging, handleDragMove, handleDragStop]);

    // Initialize state and handle property changes
    useEffect(() => {
        setContainerWidth(width);
        setHandleByValue(value);
    }, [width, value]);

    // Component view
    return (
        <>
            <div
                ref={refContainer}
                className="slider-wrapper"
            >
                <div
                    ref={refBar}
                    className="slider-bar"
                >
                    <div
                        ref={refHandle}
                        className={`slider-handle ${isDragging && 'slider-handle--dragging'}`}
                        onMouseDown={handleDragStart}
                        onTouchStart={handleDragStart}
                    ></div>
                </div>
            </div>
        </>
    );
}

export default Slider;