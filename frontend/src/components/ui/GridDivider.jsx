const pixels = [
    { col: 1, row: 1 },
    { col: 3, row: 1 },
    { col: 4, row: 1 },
    { col: 5, row: 1 },
    { col: 7, row: 1 },
    { col: 8, row: 1 },

    { col: 1, row: 2 },
    { col: 2, row: 2 },
    { col: 4, row: 2 },
    { col: 6, row: 2 },
    { col: 7, row: 2 },
];

export default function PixelDivider() {
    return (
        <div className="flex justify-start w-full opacity-60">
            <div
                className="grid gap-[1px] md:gap-[5px]"
                style={{
                    gridTemplateColumns: "repeat(8, clamp(40px, 4.5vw, 84px))",
                    gridTemplateRows: "repeat(2, clamp(40px, 4.5vw, 84px))",
                }}
            >
                {pixels.map((pixel, index) => (
                    <div
                        key={index}
                        className="rounded-[8px] bg-[#C84B2D]"
                        style={{
                            gridColumn: pixel.col,
                            gridRow: pixel.row,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}