import { useEffect, useRef } from 'react';

/**
 * Custom hook to trigger animations when elements enter viewport
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Intersection threshold (0-1)
 * @param {string} options.rootMargin - Margin around root element
 * @returns {React.RefObject} - Ref to attach to the element
 */
export const useScrollAnimation = (options = {}) => {
  const ref = useRef(null);
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px'
  } = options;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-animate');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin]);

  return ref;
};

/**
 * Custom hook for staggered child animations
 * @param {React.RefObject} parentRef - Reference to parent element
 * @param {number} delayIncrement - Delay between each child (ms)
 */
export const useStaggerAnimation = (parentRef, delayIncrement = 80) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = Array.from(entry.target.children);
            children.forEach((child, index) => {
              child.classList.add('scroll-animate');
              child.style.animation = `scrollZoomFadeUp 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${index * delayIncrement}ms forwards`;
              child.style.opacity = '0';
            });
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (parentRef?.current) {
      observer.observe(parentRef.current);
    }

    return () => {
      if (parentRef?.current) {
        observer.unobserve(parentRef.current);
      }
    };
  }, [parentRef, delayIncrement]);
};
