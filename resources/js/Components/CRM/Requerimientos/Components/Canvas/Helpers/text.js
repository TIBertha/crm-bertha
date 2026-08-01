export function drawAutoText(ctx, text, {
    x,
    y,
    maxWidth,
    maxLines = 2,
    baseSize = 35,
    color = "#ff0080",
    align = "left",
    fontWeight = "normal",
    lineSpacing = 10,
}) {
    if (!text) return y;

    ctx.fillStyle = color;
    ctx.textAlign = align;

    let size = baseSize;
    ctx.font = `${fontWeight} ${size}px Google Sans, sans-serif`;

    if (ctx.measureText(text).width <= maxWidth) {
        ctx.fillText(text, x, Math.round(y));
        return y + size + lineSpacing;
    }

    while (ctx.measureText(text).width > maxWidth && size > 28) {
        size -= 1;
        ctx.font = `${fontWeight} ${size}px Google Sans, sans-serif`;
    }

    const words = text.split(" ");
    let line = "";
    let lines = [];

    for (let w of words) {
        const testLine = line + w + " ";
        if (ctx.measureText(testLine).width > maxWidth) {
            lines.push(line.trim());
            line = w + " ";
        } else {
            line = testLine;
        }
    }
    lines.push(line.trim());

    lines = lines.slice(0, maxLines);

    lines.forEach((ln, i) => {
        ctx.fillText(ln, x, Math.round(y + (i * (size + lineSpacing))));
    });

    return y + (lines.length * (size + lineSpacing));
}

export function drawList(ctx, items, {
    x,
    y,
    size = 30,
    spacing = 35,
    color = "#ff0080",
    fontWeight = "normal",
    align = "left",
}) {
    if (!items || !items.length) return y;

    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.font = `${fontWeight} ${size}px Google Sans, sans-serif`;

    items.forEach((h, i) => {
        const text = `${h.dia}: ${h.ingreso} a ${h.salida}`;
        ctx.fillText(text, x, Math.round(y + (i * spacing)));
    });

    return y + (items.length * spacing);
}

export function drawSalary(ctx, sueldo, { x, y, big = false }) {
    if (!sueldo) return;

    const size = big ? 110 : 90;

    ctx.fillStyle = "#ff0080";
    ctx.textAlign = "left";
    ctx.font = `bold ${size}px Google Sans, sans-serif`;
    ctx.fillText(sueldo, x, Math.round(y));
}

export function drawCenteredText(ctx, text, { x, y, size = 40, color = "white" }) {
    if (!text) return;

    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.font = `normal ${size}px Google Sans, sans-serif`;
    ctx.fillText(text, x, Math.round(y));
}
