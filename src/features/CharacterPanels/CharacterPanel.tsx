import * as React from "react";
import { useTranslation } from "react-i18next";
import styles from "./characters.module.css";

export type CharacterItem = {
    id: string;
    avatarSrc: string;
    imageSrc?: string;
    avatarAlt?: string;

    title: string;
    subtitle?: string;
    description?: string;
};

type Props = {
    items: CharacterItem[]; // min 1
    initialSelectedId?: string;
    avatarSize?: number; // px (todos iguales)
    gap?: number; // px
    onSelectedChange?: (id: string) => void;
    accentColor?: string; // CSS color for the selected avatar border
};

function useElementWidth<T extends HTMLElement>() {
    const ref = React.useRef<T | null>(null);
    const [width, setWidth] = React.useState(0);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const ro = new ResizeObserver((entries) => {
            const w = entries[0]?.contentRect?.width ?? 0;
            setWidth(w);
        });
        ro.observe(el);

        // initial
        setWidth(el.getBoundingClientRect().width);

        return () => ro.disconnect();
    }, []);

    return { ref, width };
}

export default function CharactersPanel({
    items,
    initialSelectedId,
    avatarSize = 44,
    gap = 8,
    onSelectedChange,
    accentColor
}: Props) {
    if (!items?.length) return null;

    const initialId =
        initialSelectedId && items.some((x) => x.id === initialSelectedId)
            ? initialSelectedId
            : items[0].id;

    const [selectedId, setSelectedId] = React.useState(initialId);

    // contenedor que determina cuántos caben
    const { ref: barRef, width: barWidth } = useElementWidth<HTMLDivElement>();

    // Calcula cuántos avatares caben completos.
    // Fórmula: n*(avatarSize) + (n-1)*gap <= barWidth
    // => n <= (barWidth + gap) / (avatarSize + gap)
    const computedVisible = React.useMemo(() => {
        if (barWidth <= 0) return 1;
        const n = Math.floor((barWidth + gap) / (avatarSize + gap));
        return Math.max(1, Math.min(n, items.length));
    }, [barWidth, gap, avatarSize, items.length]);

    // start index de la ventana
    const [start, setStart] = React.useState(0);

    // Mantener el seleccionado siempre visible dentro de la ventana
    React.useEffect(() => {
        const selectedIndex = items.findIndex((x) => x.id === selectedId);
        if (selectedIndex < 0) return;

        setStart((currentStart) => {
            const maxStart = Math.max(0, items.length - computedVisible);

            // Si ya es visible, no tocar start
            const currentEnd = currentStart + computedVisible - 1;
            if (selectedIndex >= currentStart && selectedIndex <= currentEnd) {
                return currentStart;
            }

            // Si quedó a la izquierda: mover ventana para que sea el primero visible
            if (selectedIndex < currentStart) {
                return Math.max(0, Math.min(selectedIndex, maxStart));
            }

            // Si quedó a la derecha: mover ventana para que sea el último visible
            const newStart = selectedIndex - (computedVisible - 1);
            return Math.max(0, Math.min(newStart, maxStart));
        });
    }, [items, selectedId, computedVisible]);

    // Ajusta start si cambia computedVisible o items.length (evita desbordes)
    React.useEffect(() => {
        setStart((s) => Math.min(s, Math.max(0, items.length - computedVisible)));
    }, [items.length, computedVisible]);

    const endExclusive = Math.min(items.length, start + computedVisible);
    const visibleItems = items.slice(start, endExclusive);

    const canPrev = start > 0;
    const canNext = endExclusive < items.length;

    const handleSelect = (id: string) => {
        setSelectedId(id);
        onSelectedChange?.(id);
    };

    const handleNext = () => {
        if (!canNext) return;
        setStart((s) => Math.min(s + 1, items.length - computedVisible));
    };

    const handlePrev = () => {
        if (!canPrev) return;
        setStart((s) => Math.max(0, s - 1));
    };

    const selected = items.find((x) => x.id === selectedId) ?? items[0];

    const title = selected.title;
    const subtitle = selected.subtitle || "";
    const description = selected.description;

    return (
        <section className={styles.root} style={
            {
                ["--accent-color" as any]: accentColor,
            } as React.CSSProperties
        } aria-label="Characters panel">
            <header className={styles.avatarBar} aria-label="Character avatars">
                {canPrev ? (
                    <button
                        type="button"
                        className={styles.navBtn}
                        onClick={handlePrev}
                        aria-label="Previous avatars"
                        data-dir="prev"
                    />
                ) : (
                    <span className={styles.navBtnSpacer} aria-hidden="true" />
                )}

                <div
                    ref={barRef}
                    className={styles.avatarViewport}
                    style={
                        {
                            ["--avatarSize" as any]: `${avatarSize}px`,
                            ["--gap" as any]: `${gap}px`,
                        } as React.CSSProperties
                    }
                >
                    <div className={styles.avatarRow} role="list">
                        {visibleItems.map((item) => {
                            const isSelected = item.id === selectedId;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={
                                        isSelected
                                            ? `${styles.avatarBtn} ${styles.avatarBtnActive}`
                                            : styles.avatarBtn
                                    }
                                    onClick={() => handleSelect(item.id)}
                                    aria-pressed={isSelected}
                                    aria-label={item.avatarAlt ?? item.id}
                                >
                                    <img
                                        className={styles.avatarImg}
                                        src={item.avatarSrc}
                                        alt={item.avatarAlt ?? item.id}
                                        width={avatarSize}
                                        height={avatarSize}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {canNext ? (
                    <button
                        type="button"
                        className={styles.navBtn}
                        onClick={handleNext}
                        aria-label="Next avatars"
                        data-dir="next"
                    />
                ) : (
                    <span className={styles.navBtnSpacer} aria-hidden="true" />
                )}
            </header>

            <div className={styles.content}>
                {selected.imageSrc ? (
                    <div className={styles.left}>
                        <img className={styles.mainImg} src={selected.imageSrc} alt="" />
                    </div>
                ) : (
                    <div className={styles.leftEmpty} aria-hidden="true" />
                )}

                <div className={styles.right}>
                    <h2 className={styles.title}>{title}</h2>
                    <p className={styles.subtitle}>{subtitle || "\u00A0"}</p>
                    <p className={styles.description}>{description}</p>
                </div>
            </div>
        </section>
    );
}
