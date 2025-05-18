import { motion } from "framer-motion";

export default function OrientationPrompt() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0.5, 1] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        color: "white",
        fontSize: "clamp(1rem, 4vw, 1.5rem)",
        fontWeight: 600,
        textAlign: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        padding: "1rem 2rem",
        borderRadius: "12px",
        zIndex: 1000,
      }}
    >
      Please rotate your device to landscape
    </motion.div>
  );
}
