import Cookies from 'cookies-js'
import { showInfo } from './menuReducer'
import { showSetDestinationTooltip } from './originTargetReducer'

const initialVisitorState = {
  visitedBefore: false,
}

const visitorReducer = (store = initialVisitorState, action) => {

  switch (action.type) {

    case 'VISITED_BEFORE': return { ...store, visitedBefore: true }

    default:
      return store
  }
}

export const setVisitedCookie = () => {
  return async (dispatch) => {
    Cookies.set('visited', 'yes')
    console.log("set visited before cookie to 'yes'")
    dispatch({ type: 'VISITED_BEFORE' })
  }
}

export const getVisitedCookie = () => {
  const visited = Cookies.get('visited')
  console.log('visited before (cookie):', visited)
  return visited
}

export const showWelcomeIfFirstVisit = () => {
  return async (dispatch) => {
    const visited = getVisitedCookie()
    if (visited === 'yes') {
      dispatch(showSetDestinationTooltip())
      dispatch({ type: 'VISITED_BEFORE' })
    } else {
      dispatch(showInfo())
    }
  }
}

export default visitorReducer
