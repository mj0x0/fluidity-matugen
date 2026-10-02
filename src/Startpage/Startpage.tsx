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
`

const Image = styled.img`
  height: clamp(150px, 22vw, 400px);
  width: clamp(150px, 22vw, 400px);
  border: 2px solid var(--default-color);
  padding: 10px;
  object-fit: cover;

  animation: circling-shadow 4s ease 0s infinite normal;
`

export const Startpage = () => {
  const [img, setImg] = useState(DesignSettings.getWithFallback().image)
  const [expandAll, setExpandAll] = useState(false)
  const [layout] = useState(() => LayoutSettings.getWithFallback())
  const vertical = layout.orientation === "vertical"

  return (
    <Wrapper>
      <StyledStartpage>
        <div style={vertical ? { display: "flex" } : undefined}>
          <Image src={img} onError={() => setImg(images[0]!.value)} />
        </div>
        <LinkContainer
          orientation={layout.orientation}
          expandAll={expandAll}
          onExitExpandAll={() => setExpandAll(false)}
        />
      </StyledStartpage>
      <Searchbar />
      <Clock />
      <ExpandToggle
        active={expandAll}
        onToggle={() => setExpandAll(value => !value)}
      />
      <Settings />
    </Wrapper>
  )
}
