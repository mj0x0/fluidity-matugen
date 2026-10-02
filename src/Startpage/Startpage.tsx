import { useState } from "react"

import styled from "@emotion/styled"

import { Clock } from "./Clock/Clock"
import { ExpandToggle } from "./ExpandToggle/ExpandToggle"
import { LinkContainer } from "./LinkContainer/LinkContainer"
import { Searchbar } from "./Searchbar/Searchbar"
import { Settings } from "./Settings/Settings"
import {
  Design as DesignSettings,
  Layout as LayoutSettings,
} from "./Settings/settingsHandler"
import { narrowQuery, useNarrow } from "./useNarrow"
import { images } from "../data/data"

const Wrapper = styled.div`
  max-width: 1920px;
  height: 100%;
  margin: auto;
  position: relative;
`

const StyledStartpage = styled.div`
  gap: clamp(20px, 5vw, 100px);
  padding: 0 clamp(20px, 5vw, 100px);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: calc(100% - 100px);

  @media ${narrowQuery} {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    padding: 14px 16px 0;
    height: calc(100% - 90px);
  }
`

const ImageFrame = styled.div<{ vertical: boolean }>`
  ${({ vertical }) => vertical && "display: flex;"}

  @media ${narrowQuery} {
    justify-content: center;
  }
  @media ${narrowQuery} and (max-height: 600px) {
    display: none;
  }
`

const Image = styled.img`
  height: clamp(150px, 22vw, 400px);
  width: clamp(150px, 22vw, 400px);
  border: 2px solid var(--default-color);
  padding: 10px;
  object-fit: cover;

  animation: circling-shadow 4s ease 0s infinite normal;

  @media ${narrowQuery} {
    height: clamp(96px, 30vw, 150px);
    width: clamp(96px, 30vw, 150px);
    padding: 6px;
  }
`

export const Startpage = () => {
  const [img, setImg] = useState(DesignSettings.getWithFallback().image)
  const [expandAll, setExpandAll] = useState(false)
  const [layout] = useState(() => LayoutSettings.getWithFallback())
  const narrow = useNarrow()
  // Horizontal bars can't fit a phone, whatever the setting says.
  const orientation = narrow ? "vertical" : layout.orientation

  return (
    <Wrapper>
      <StyledStartpage>
        <Clock />
        <ImageFrame vertical={orientation === "vertical"}>
          <Image src={img} onError={() => setImg(images[0]!.value)} />
        </ImageFrame>
        <LinkContainer
          orientation={orientation}
          narrow={narrow}
          expandAll={expandAll}
          onExitExpandAll={() => setExpandAll(false)}
        />
      </StyledStartpage>
      <Searchbar />
      <ExpandToggle
        active={expandAll}
        onToggle={() => setExpandAll(value => !value)}
      />
      <Settings />
    </Wrapper>
  )
}
