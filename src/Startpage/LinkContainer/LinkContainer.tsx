import { MouseEvent, useState } from "react"

import styled from "@emotion/styled"

import { AccordionContainer, AccordionGroup } from "./Accordion/Accordion"
import * as Settings from "../Settings/settingsHandler"

const LinkItem = styled.a<{ dense?: boolean }>`
  max-width: fit-content;
  flex-shrink: 0;
  white-space: nowrap;
  position: relative;
  padding: ${({ dense }) => (dense ? "5px 0 5px 30px" : "10px 0 10px 30px")};
  font-size: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;

  ::before {
    position: absolute;
    left: 0px;
    bottom: 5px;
    z-index: 0;
    content: "";
    height: 5px;
    width: 100%;
    background-color: var(--accent-color);
    transition: 0.5s;
    opacity: 0.7;
  }

  /* Hide the underline bars that otherwise leak out of collapsed groups. */
  [aria-hidden="true"] &::before {
    display: none;
  }

  :hover,
  :focus {
    color: var(--accent-color2);
    animation: text-flicker 0.01s ease 0s infinite alternate;
    outline: none;
  }
`

type props = {
  expandAll?: boolean
  onExitExpandAll?: () => void
}

export const LinkContainer = ({
  expandAll = false,
  onExitExpandAll,
}: props) => {
  const [active, setActive] = useState(0)
  const linkGroups = Settings.Links.getWithFallback()

  const isActive = (groupIndex: number) => expandAll || active === groupIndex

  // In expand-all mode, selecting a title collapses back down to that group.
  const selectGroup = (groupIndex: number) => {
    setActive(groupIndex)
    if (expandAll) onExitExpandAll?.()
  }

  const middleMouseHandler = (event: MouseEvent, groupIndex: number) => {
    setActive(groupIndex)
    if (event.button === 1) {
      linkGroups[groupIndex]?.links.forEach(link => {
        window.open(link.value, "_blank")
      })
    }
  }

  return (
    <AccordionContainer>
      {linkGroups.map((group, groupIndex) => (
        <AccordionGroup
          key={group.title}
          active={isActive(groupIndex)}
          title={group.title}
          icon={group.icon}
          onClick={() => selectGroup(groupIndex)}
          onMouseDown={e => middleMouseHandler(e, groupIndex)}
        >
          {group.links.map(link => (
            <LinkItem
              dense={group.links.length > 9}
              tabIndex={!isActive(groupIndex) ? -1 : undefined}
              key={link.label}
              href={link.value}
            >
              {link.label}
            </LinkItem>
          ))}
        </AccordionGroup>
      ))}
    </AccordionContainer>
  )
}
