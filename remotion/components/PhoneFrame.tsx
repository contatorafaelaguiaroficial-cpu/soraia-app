export const PhoneFrame: React.FC<{ children: React.ReactNode; width?: number }> = ({
  children,
  width = 760,
}) => {
  const height = width * 2.05;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 64,
        background: "#0d0b14",
        border: "6px solid #2b2438",
        boxShadow: "0 40px 90px rgba(0,0,0,0.55)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: width * 0.34,
          height: 28,
          background: "#0d0b14",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          zIndex: 5,
        }}
      />
      <div style={{ width: "100%", height: "100%" }}>{children}</div>
    </div>
  );
};
