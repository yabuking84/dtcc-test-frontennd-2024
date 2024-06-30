import { motion } from "framer-motion";
import { ComponentProps } from "react";

interface Props extends ComponentProps<'div'> {
    id?: string
}

export function FadeIn({ children, className, id }: Props) {
    const variants = {
        hide: {
            y: 10, opacity: 0,
        },
        animateState: {
            y: 0, opacity: 1,
        },
    };

    return (
        <motion.div
            key={id}
            layout
            className={className}
            initial={'hide'}
            animate={'animateState'}
            exit={'hide'}
            transition={{
                bounce: 0,
                duration: 0.2
            }}
            variants={variants}
        >
            {children}
        </motion.div >
    )
}