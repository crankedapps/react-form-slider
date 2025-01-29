import { createRef, useCallback, useEffect, useState } from 'react';
import './Slider.scss';

export interface ISliderProps {
    min: number;
    max: number;
    width?: string;
    value?: number;
    onDrag?: (value: number) => void;
    onDraggingStateChanged?: (value: boolean) => void;
    onValueChanged?: (value: number) => void;
}

function Slider({ min, max, width = '100%', value = 0, onDrag, onDraggingStateChanged, onValueChanged }: ISliderProps) {

    // Init state
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);

    // Validate properties
    if (min >= max) { throw new Error('min prop must be less than max'); }
    if (value != null && value != undefined && (value < min || value > max)) { throw new Error('value prop must be between min and max'); }
    if (width.slice(-1) !== '%' && width.slice(-2).toLowerCase() !== 'px') { throw new Error('width prop must be a percentage or px string (ex: "100%" or "100px")'); }

    // Initialize element references
    const refContainer = createRef<HTMLDivElement>(); // Slider container reference
    const refBar = createRef<HTMLDivElement>(); // Slider bar reference
    const refHandle = createRef<HTMLDivElement>(); // Slider handle/knob element reference

    // Helper functions
    // Sets the center position of the handle in the bar by px
    const halfHandleWidth = (): number => refHandle.current!.offsetWidth / 2;
    const barWidth = (): number => refBar.current!.offsetWidth;
    const setContainerWidth = (newWidth: string): void => refContainer.current?.setAttribute('style', `width: ${newWidth}`);
    // Sets handle position by px and filled bar background width by px
    const setHandleByPosition = (px: number): void => {
        refHandle.current?.setAttribute('style', `left: ${px - halfHandleWidth()}px`); // Set position of handle
        refBar.current?.setAttribute('style', `--data-filled-width: ${px + halfHandleWidth()}px`); // Set width of filled background color of bar
    }
    // Updates handle position based on value, and filled bar width based on new value
    const setHandleByValue = (newValue: number): void => {
        const percent = (newValue - min) / (max - min);
        const left = percent * barWidth();
        setHandleByPosition(left);
    }
    // Get value by handle position
    const getValueByHandlePosition = (): number => {
        const left = refHandle.current!.offsetLeft + halfHandleWidth();
        const percent = left / barWidth();
        return percent * (max - min) + min;
    };
    // Stop event propagation
    const eventStopPropagation = (event: MouseEvent | TouchEvent): void => {
        event.stopPropagation();
        event.preventDefault();
    };

    // Drag stop event (mouse up or touch end)
    const handleDragStop = useCallback((event: MouseEvent | TouchEvent): void => {
        if (!isDragging) return;
        eventStopPropagation(event);
        setIsDragging(false);
        if (onValueChanged) onValueChanged(getValueByHandlePosition());
        if (onDraggingStateChanged) onDraggingStateChanged(false);
    }, [isDragging, onValueChanged, onDraggingStateChanged, getValueByHandlePosition]);

    // Drag move event (mouse move or touch move)
    const handleDragMove = useCallback((event: MouseEvent | TouchEvent): void => {
        if (!isDragging) return;
        eventStopPropagation(event);
        const x = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
        // Calculate left position of handle considering click position offset
        const newLeft = x - dragOffset;
        // Calculate left/right limits of bar
        const leftLimit = -(refHandle.current!.offsetWidth / 2);
        const rightLimit = refBar.current!.offsetWidth - (refHandle.current!.offsetWidth / 2);
        // Ensure new position is within limits of bar
        const newLeftWithinLimits = Math.min(Math.max(newLeft, leftLimit), rightLimit);
        // Set position of handle
        refHandle.current?.setAttribute('style', `left: ${newLeftWithinLimits}px`);
        // Set width of filled background color of bar
        refBar.current?.setAttribute('style', `--data-filled-width: ${newLeftWithinLimits + (refHandle.current!.offsetWidth / 2)}px`);
        if (onDrag) onDrag(getValueByHandlePosition());
    }, [isDragging, dragOffset, refHandle, refBar, onValueChanged, getValueByHandlePosition]);

    // Drag start event (mouse down or touch start)
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