  const generateBooks = () => {
    const colors = [
      "#8B4513",
      "#A0522D",
      "#654321",
      "#704214",
      "#6B5344",
      "#8B7355",
      "#9370DB",
      "#6A5ACD",
      "#483D8B",
      "#2F4F4F",
      "#4B0082",
      "#191970",
      "#8B0000",
      "#DC143C",
      "#CD5C5C",
    ];
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      color: colors[Math.floor(Math.random() * colors.length)],
      height: Math.random() * 40 + 60,
    }));
  };

  export default generateBooks