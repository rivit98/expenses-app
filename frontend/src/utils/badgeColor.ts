/**
 * Generates a deterministic badge color from a label string.
 * Uses a string hash to pick a hue, then returns background + text colors
 * with guaranteed readable contrast.
 */

const hashString = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
};

const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r = 0,
        g = 0,
        b = 0;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];

    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
};

const relativeLuminance = (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r / 255, g / 255, b / 255].map((c) =>
        c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

export interface BadgeColor {
    bg: string;
    color: string;
}

export const getBadgeColor = (label: string): BadgeColor => {
    const hue = hashString(label) % 360;
    const saturation = 0.55;
    const lightness = 0.45;

    const [r, g, b] = hslToRgb(hue, saturation, lightness);
    const lum = relativeLuminance(r, g, b);
    const textColor = lum > 0.18 ? '#1A202C' : '#FFFFFF';

    return {
        bg: `hsl(${hue}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`,
        color: textColor,
    };
};
