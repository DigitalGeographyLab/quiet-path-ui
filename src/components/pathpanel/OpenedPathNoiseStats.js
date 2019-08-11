import React from 'react'
import styled, { css } from 'styled-components'
import { utils } from '../../utils/index'

const StyledOpenedPathNoiseStats = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  pointer-events: auto;
  border-radius: 5px;
  margin: 4px 0px 4px 0px
  background-color: white;
  border: 2px solid transparent;
  padding: 3px 4px;
  color: black;
  cursor: default;
  transition-duration: 0.12s;
  width: 95%;
  margin: auto;
`
const PathPropsRow = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: 14px;
  width: 100%;
`
const FlexCols = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 1px 0px 1px;
  justify-content: space-evenly;
`
const KeyValueFlex = styled.div`
  display: flex;
  margin: 0px;
  white-space: nowrap;
`
const DBKey = styled.div`
  border-radius: 4px;
  margin: 2px 1px 2px 3px;
  color: white;
  font-size: 12px;
  background-color: black;
  padding: 2px 5px;
`
const DistDiffBox = styled(DBKey)`
  background-color: transparent;
  padding: 2px 3px;
  color: black;
  padding: 2px 2px;
  ${props => props.value < 0 && css`
    background-color: green;
    margin: 2px 3px 2px 3px;
    padding: 2px 5px;
    color: white;
  `}
`
const DistBox = styled.div`
  font-size: 12px;
  padding: 2px 2px;
  margin: 2px 2px 2px 1px;
  background-color: white;
  color: black;
`

const DBLenDiff = ({ dB, path }) => {
  let dist = path.properties.noises[dB]
  let distObj = { m: 0, string: '0 m' }
  let distDiffObj = { m: 0, string: '0 m' }
  if (dist) {
    distObj = utils.getFormattedDistanceString(dist, false)
    distDiffObj = utils.getFormattedDistanceString(path.properties.noises_diff[dB], true)
  }
  return (
    <KeyValueFlex>
      <DBKey dB={dB}>{dB}dB</DBKey>
      <DistDiffBox value={distDiffObj.m}> {distDiffObj.string}</DistDiffBox>
      <DistBox> {' ('}{distObj.string}{')'}</DistBox>
    </KeyValueFlex>
  )
}

const QuietPathNoiseInfo = ({ path }) => {
  return (
    <PathPropsRow>
      <FlexCols >
        <DBLenDiff path={path} dB={50} />
        <DBLenDiff path={path} dB={55} />
        <DBLenDiff path={path} dB={60} />
      </FlexCols>
      <FlexCols>
        <DBLenDiff path={path} dB={65} />
        <DBLenDiff path={path} dB={70} />
        <DBLenDiff path={path} dB={75} />
      </FlexCols>
    </PathPropsRow>
  )
}

export const OpenedPathNoiseStats = ({ path, pathType }) => {
  return (
    <StyledOpenedPathNoiseStats pathType={pathType}>
      <QuietPathNoiseInfo path={path} />
    </StyledOpenedPathNoiseStats >
  )
}
