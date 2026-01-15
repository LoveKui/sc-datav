import styled, { keyframes, css } from "styled-components";

// 定义一个旋转动画，让选中的按钮“动起来”
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const GradientBtn = styled.button<{
  $color?: string[];
  $isSelected?: boolean; // 新增选中属性
}>`
  position: relative;
  padding: 12px 24px;
  font-size: 18px;
  font-weight: bold;
  color: white;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 50px;
  overflow: hidden;
  transition: all 0.3s ease;

  /* 选中时的整体缩放稍微放大一点点 */
  transform: ${({ $isSelected }) => ($isSelected ? "scale(1.05)" : "scale(1)")};

  &:hover {
    transform: scale(1.08);
  }

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: ${({ $color }) =>
      `conic-gradient(from 0deg, ${$color?.join(", ") ?? "#aca891, #6e918c"})`};
    z-index: -2;
    /* 选中时模糊度降低，让颜色更锐利 */
    filter: ${({ $isSelected }) => ($isSelected ? "blur(15px)" : "blur(10px)")};
    
    /* 选中时持续旋转 */
    animation: ${({ $isSelected }) =>
      $isSelected ? css`${rotate} 3s linear infinite` : "none"};
    
    transition: transform 1.5s ease-in-out, filter 0.3s ease;
  }

  &::after {
    content: "";
    position: absolute;
    /* 选中时，内层黑色收缩，让边框显得更宽 */
    inset: ${({ $isSelected }) => ($isSelected ? "2px" : "4px")};
    background: ${({ $isSelected }) => ($isSelected ? "#1a1a1a" : "black")};
    border-radius: 47px;
    z-index: -1;
    transition: all 0.3s ease;
  }
`;

const GradientText = styled.div<{
  $color?: string[];
  $isSelected?: boolean;
}>`
  color: ${({ $isSelected }) => ($isSelected ? "white" : "transparent")};
  background: ${({ $color, $isSelected }) =>
    $isSelected 
      ? "none" // 选中时文字直接变白，或者保持渐变
      : `conic-gradient(from 0deg, ${$color?.join(", ") ?? "#aca891, #6e918c"})`};
  background-clip: text;
  -webkit-background-clip: text;
  transition: all 0.3s ease;
  /* 选中时给文字加一点外发光 */
  text-shadow: ${({ $isSelected }) => ($isSelected ? "0 0 8px rgba(255,255,255,0.5)" : "none")};
`;

// 类型定义
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $color?: string[];
  $isSelected?: boolean;
}

export default function Button({ children, $color, $isSelected, ...args }: Props) {
  return (
    <GradientBtn $color={$color} $isSelected={$isSelected} {...args}>
      <GradientText $color={$color} $isSelected={$isSelected}>
        {children}
      </GradientText>
    </GradientBtn>
  );
}