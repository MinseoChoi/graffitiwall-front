import './Canvasboard.css';
import React, { useRef, useEffect, useState } from 'react';

const Canvasboard = () => {
    const [ctx, setCtx] = useState();
    const canvasRef = useRef(null);

    const array = []
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.lineJoin = 'round';
        context.lineWidth = 3;
        context.strokeStyle = 'blue'
        setCtx(context);
    }, [])

    const canvasEventListener = (event, type) => {
        let x = event.clientX - event.target.offsetLeft;
        let y = event.clientY - event.target.offsetTop;
        if (type === 'move') {
            if (array.length === 0) {
                array.push({ x, y })
            } else {
                ctx.save()
                ctx.beginPath();
                ctx.moveTo(array[array.length - 1].x, array[array.length - 1].y);
                ctx.lineTo(x, y);
                ctx.closePath();
                ctx.stroke()
                ctx.restore();
                array.push({ x, y})
            }
        } else if (type === 'leave') {
            ctx.save()
            ctx.clearRect(0, 0, 2500, 2500)
            ctx.restore()
        }
    }
    return (
        <div className='container'>
            <canvas ref={canvasRef} id="canvas" style={{ width: "80%", height: "77vh" }}
                onMouseDown = {(event) => { canvasEventListener(event, 'down') }}
                onMouseMove = {(event) => { canvasEventListener(event, 'move') }}
                onMouseLeave = {(event) => { canvasEventListener(event, 'leave') }}
                onMouseUp = {(event) => { canvasEventListener(event, 'up') }}>
            </canvas>
        </div>
    );
}

export default Canvasboard;