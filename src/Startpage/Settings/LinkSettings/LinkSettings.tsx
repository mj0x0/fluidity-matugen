import styled from "@emotion/styled"

import { OptionTextArea } from "./OptionTextArea"
import { linkGroup } from "../../../data/data"
import { SettingsLabel } from "../SettingsWindow"
import { narrowQuery } from "../../useNarrow"

interface props {
  linkGroups: linkGroup[]
  setLinkGroups: (value: linkGroup[]) => void
}
export const GeneralSettingsContent = styled.div`
  width: 100%;

  @media ${narrowQuery} {
    flex: 1;
    min-height: 0;
    > div {
      box-sizing: border-box;
      height: calc(100% - 44px);
    }
  }
`

export const LinkSettings = ({ linkGroups, setLinkGroups }: props) => (
  <GeneralSettingsContent>
    <SettingsLabel>Links</SettingsLabel>
    <OptionTextArea onChange={setLinkGroups} initialValue={linkGroups} />
  </GeneralSettingsContent>
)
