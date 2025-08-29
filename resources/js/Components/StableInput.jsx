import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

// A stable input component that maintains focus even during parent re-renders
const StableInput = forwardRef(({ 
    type = 'text', 
    value, 
    onChange, 
    className = '', 
    placeholder = '',
    rows,
    ...props 
}, ref) => {
    const inputRef = useRef(null);
    const lastValueRef = useRef(value);
    const selectionRef = useRef({ start: 0, end: 0 });

    // Expose the input ref to parent components
    useImperativeHandle(ref, () => inputRef.current);

    // Store cursor position before potential re-render
    const storeCursorPosition = () => {
        if (inputRef.current) {
            selectionRef.current = {
                start: inputRef.current.selectionStart || 0,
                end: inputRef.current.selectionEnd || 0
            };
        }
    };

    // Restore cursor position after re-render
    const restoreCursorPosition = () => {
        if (inputRef.current && document.activeElement === inputRef.current) {
            const { start, end } = selectionRef.current;
            inputRef.current.setSelectionRange(start, end);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        storeCursorPosition();
        lastValueRef.current = e.target.value;
        if (onChange) {
            onChange(e);
        }
    };

    // Handle focus events
    const handleFocus = (e) => {
        storeCursorPosition();
        if (props.onFocus) {
            props.onFocus(e);
        }
    };

    // Handle blur events  
    const handleBlur = (e) => {
        if (props.onBlur) {
            props.onBlur(e);
        }
    };

    // Handle key events to store cursor position
    const handleKeyUp = (e) => {
        storeCursorPosition();
        if (props.onKeyUp) {
            props.onKeyUp(e);
        }
    };

    const handleClick = (e) => {
        storeCursorPosition();
        if (props.onClick) {
            props.onClick(e);
        }
    };

    // Restore cursor position when component updates
    useEffect(() => {
        if (lastValueRef.current === value) {
            restoreCursorPosition();
        }
        lastValueRef.current = value;
    }, [value]);

    const commonProps = {
        ...props,
        ref: inputRef,
        value: value || '',
        onChange: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onKeyUp: handleKeyUp,
        onClick: handleClick,
        className,
        placeholder,
    };

    // Render textarea for multiline inputs
    if (rows || type === 'textarea') {
        return <textarea {...commonProps} rows={rows} />;
    }

    // Render regular input
    return <input {...commonProps} type={type} />;
});

StableInput.displayName = 'StableInput';

export default StableInput;
