import copy from "copy-to-clipboard"
import { FC, ReactNode, useCallback } from "react"
import styled from "styled-components"

import { ClickedLabelButton, IClickedLabelButton } from "./Button"
import { ContentCopyIcon, DoneIcon } from "./Icons/MuiIcons"

const ClickedIconButton = styled(ClickedLabelButton)`
  padding: 6px;
`

interface ICopyIconButton
  extends Omit<IClickedLabelButton, "label" | "clickedLabel"> {
  label?: ReactNode
  clickedLabel?: ReactNode
  copyValue: string
}

export const CopyIconButton: FC<ICopyIconButton> = ({
  copyValue,
  variant = "transparent",
  size = "s",
  label = <ContentCopyIcon fontSize="inherit" />,
  clickedLabel = <DoneIcon fontSize="inherit" />,
  ...rest
}) => {
  const onClick = useCallback(() => {
    copy(copyValue)
  }, [copyValue])
  return (
    <ClickedIconButton
      variant={variant}
      size={size}
      label={label}
      clickedLabel={clickedLabel}
      onClick={onClick}
      {...rest}
    ></ClickedIconButton>
  )
}
