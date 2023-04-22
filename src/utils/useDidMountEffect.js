import React, { useEffect, useRef } from 'react';

const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) {
            const unmount = func();
            return () => {
                didMount.current = false;
                unmount && unmount();
            }
        }
        else didMount.current = true;
    }, deps);
};

export default useDidMountEffect;