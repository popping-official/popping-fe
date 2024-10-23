"use client";
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { CompactPicker } from "react-color";
import { DefaultLayout } from "@/app/components/layout";
import { COLORS } from "@/public/styles/colors";

const GRID_SIZE = 20;

const DotCharacterEditor: React.FC = () => {
  const [grid, setGrid] = useState(() =>
    Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill("#ffffff"))
  );
  const isMouseDownRef = useRef(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const selectedColorRef = useRef(selectedColor);
  const [cellSize, setCellSize] = useState(20);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    selectedColorRef.current = selectedColor;
  }, [selectedColor]);

  useEffect(() => {
    const updateCellSize = () => {
      if (gridContainerRef.current) {
        const containerWidth = gridContainerRef.current.clientWidth;
        const containerHeight = gridContainerRef.current.clientHeight;
        const containerSize = Math.min(containerWidth, containerHeight);
        const newSize = containerSize / GRID_SIZE;
        setCellSize(newSize - 2);
      }
    };

    updateCellSize();
    window.addEventListener("resize", updateCellSize);

    return () => {
      window.removeEventListener("resize", updateCellSize);
    };
  }, []);

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isMouseDownRef.current) {
      const element = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement;
      if (element && element.dataset.row && element.dataset.col) {
        const row = parseInt(element.dataset.row, 10);
        const col = parseInt(element.dataset.col, 10);
        handleCellColor(row, col);
      }
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (isMouseDownRef.current && event.touches.length === 1) {
      event.preventDefault();
      const touch = event.touches[0];
      const element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
      if (element && element.dataset.row && element.dataset.col) {
        const row = parseInt(element.dataset.row, 10);
        const col = parseInt(element.dataset.col, 10);
        handleCellColor(row, col);
      }
    }
  };

  const handleTouchStart = (event: TouchEvent) => {
    if (gridContainerRef.current && gridContainerRef.current.contains(event.target as Node)) {
      if (event.touches.length === 1) {
        event.preventDefault();
        isMouseDownRef.current = true;
        const touch = event.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
        if (element && element.dataset.row && element.dataset.col) {
          const row = parseInt(element.dataset.row, 10);
          const col = parseInt(element.dataset.col, 10);
          handleCellColor(row, col);
        }
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleMouseUp);
    document.addEventListener("touchstart", handleTouchStart, { passive: false });

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleMouseUp);
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  const handleMouseDown = (row: number, col: number) => {
    isMouseDownRef.current = true;
    handleCellColor(row, col);
  };

  const handleCellColor = (row: number, col: number) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[row][col] = selectedColorRef.current;
      return newGrid;
    });
  };

  const handleColorChange = (color: any) => {
    setSelectedColor(color.hex);
  };

  const handleSave = () => {
    const SCALE_FACTOR = 10;
    const canvas = document.createElement("canvas");
    canvas.width = GRID_SIZE * SCALE_FACTOR;
    canvas.height = GRID_SIZE * SCALE_FACTOR;
    const ctx = canvas.getContext("2d");

    if (ctx) {
      grid.forEach((row, rowIndex) => {
        row.forEach((color, colIndex) => {
          ctx.fillStyle = color;
          ctx.fillRect(colIndex * SCALE_FACTOR, rowIndex * SCALE_FACTOR, SCALE_FACTOR, SCALE_FACTOR);
        });
      });

      const dataUrl = canvas.toDataURL();
      sessionStorage.setItem("dotCharacter", dataUrl);
      alert("Character saved to session!");
    }
  };

  const handleReset = () => {
    setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill("#ffffff")));
  };

  return (
    <DefaultLayout top={0} left={20} right={20} bottom={0}>
      <Container>
        <ColorPalette>
          <CompactPicker color={selectedColor} onChange={(color) => setSelectedColor(color.hex)} />
        </ColorPalette>
        <GridContainer ref={gridContainerRef}>
          {grid.map((row, rowIndex) =>
            row.map((color, colIndex) => (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                color={color}
                data-row={rowIndex}
                data-col={colIndex}
                onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                style={{ width: cellSize, height: cellSize }}
              />
            ))
          )}
        </GridContainer>
        <ButtonContainer>
          <Button onClick={handleSave}>Save Character</Button>
          <Button onClick={handleReset}>Reset</Button>
        </ButtonContainer>
      </Container>
    </DefaultLayout>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100dvh;
  background-color: ${COLORS.mainColor};
`;

const ColorPalette = styled.div`
  display: flex;
  margin-bottom: 20px;
  gap: 5px;
  flex-direction: column;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(${GRID_SIZE}, 1fr);
  grid-template-rows: repeat(${GRID_SIZE}, 1fr);
  user-select: none;
`;

const Cell = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #005bb5;
  }
`;

export default DotCharacterEditor;
