import * as React from "react";
import { useTranslation } from "react-i18next";
import styles from "./productInfo.module.css";

type Props = {
    srcCover?: string | null;
    title: string;
    subtitle?: string;
    description?: string;
    accentColor?: string;
};

export default function ProductInfo({
    srcCover,
    title,
    subtitle,
    description,
    accentColor
}: Props) {

    return (
        <section className={styles.root} style={
            {
                ["--accent-color" as any]: accentColor,
            } as React.CSSProperties
        } aria-label="Project Information">
            <div className={styles.content}>
                {srcCover ? (
                    <div className={styles.left}>
                        <img className={styles.mainImg} src={srcCover} alt="" />
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
