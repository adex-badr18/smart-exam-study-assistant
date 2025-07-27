import React, { useEffect, useRef } from "react";

/**
 * A reusable component that scrollls to a specified DOM element
 * when certain watched props change.
 *
 * @param {object} props - The component props.
 * @param {Array<string>} props.dependencies - An array of values to watch for changes.
 * When any value in this array changes, the scroll action is triggered.
 * This behaves like a dependency array for useEffect.
 * @param {string} props.targetSelector - A CSS selector string (e.g. '#top-of-page' or '.main-content')
 * The component will scroll to the first element matching this selector.
 * @param {'auto' | 'smooth'} [props.behavior='smooth'] - The scroll behavior.
 * 'smooth' for animated scroll behavior, 'auto' for instant scroll.
 * @param {React.ReactNode} props.children - The child components to render within this wrapper.
 */
const ScrollToLocation = ({
    dependencies,
    targetSelector,
    behavior = "smooth",
    children,
}) => {
    const prevDependenciesRef = useRef(dependencies);

    useEffect(() => {
        const hasPropsChanged = prevDependenciesRef.current.some(
            (prevDependency, i) => prevDependency !== dependencies[i]
        );

        if (hasPropsChanged) {
            const targetElement = document.querySelector(targetSelector);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior });
            } else {
                console.warn(
                    `ScrollToLocation: Target element not found for selector "${targetSelector}"`
                );
            }
        }

        prevDependenciesRef.current = dependencies;
    }, [dependencies, targetSelector, behavior]);

    return <>{children}</>;
};

export default ScrollToLocation;
