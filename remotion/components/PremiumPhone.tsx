export const PremiumPhone: React.FC<{
  width?: number;
  height?: number;
  children: React.ReactNode;
}> = ({ width = 560, height = 1050, children }) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 56,
        padding: 2,
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.28), rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.10))",
        boxShadow: "0 60px 110px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 54,
          background: "#0e0c13",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            width: width * 0.21,
            height: 34,
            borderRadius: 20,
            background: "#000",
            zIndex: 6,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(115deg, rgba(255,255,255,0.05) 0%, transparent 22%)",
            zIndex: 5,
            pointerEvents: "none",
          }}
        />
        {children}
      </div>
    </div>
  );
};
