import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(cleanup);

// Older jsdom versions have no PointerEvent, which drops `pointerType` from fired events.
if (typeof window.PointerEvent === 'undefined') {
    class PointerEventPolyfill extends MouseEvent {
        pointerType: string;

        constructor(type: string, init: PointerEventInit = {}) {
            super(type, init);
            this.pointerType = init.pointerType ?? '';
        }
    }

    window.PointerEvent = PointerEventPolyfill as unknown as typeof PointerEvent;
}
