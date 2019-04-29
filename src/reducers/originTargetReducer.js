import { turf } from '../utils/index'
import { initialOriginTargetFeatures } from './../constants'
import { closePopup } from './mapPopupReducer'
import { startTrackingUserLocation } from './userLocationReducer'
import { getQuietPaths } from './pathsReducer'
import { utils } from './../utils/index'

const initialOriginTarget = {
  originTargetFC: turf.asFeatureCollection(process.env.NODE_ENV !== 'production' ? initialOriginTargetFeatures : []),
  useUserLocOrigin: false,
}

const pathsReducer = (store = initialOriginTarget, action) => {

  switch (action.type) {

    case 'RESET_ORIGIN_TARGET':
      return initialOriginTarget

    case 'SET_ORIGIN': {
      const originTargetFC = updateOriginToFC(store.originTargetFC, action.lngLat)
      return { ...store, originTargetFC, useUserLocOrigin: false }
    }

    case 'SET_ORIGIN_TO_USER_LOC': {
      const originTargetFC = updateOriginToFC(store.originTargetFC, action.userLngLat)
      return { ...store, originTargetFC, useUserLocOrigin: true }
    }

    case 'WAIT_FOR_USER_LOC_ORIGIN': {
      const onlyTargetFeat = store.originTargetFC.features.filter(feat => feat.properties.type === 'target')
      return { ...store, useUserLocOrigin: true, originTargetFC: turf.asFeatureCollection(onlyTargetFeat) }
    }

    case 'UPDATE_USER_LOCATION': {
      if (store.useUserLocOrigin) {
        return { ...store, originTargetFC: updateOriginToFC(store.originTargetFC, turf.toLngLat(action.coords)) }
      } else return store
    }

    case 'SET_TARGET': {
      return { ...store, originTargetFC: action.updateOriginTargetFC }
    }

    default:
      return store
  }
}

export const setOrigin = (lngLat) => {
  return async (dispatch) => {
    dispatch({ type: 'SET_ORIGIN', lngLat })
    dispatch(closePopup())
  }
}

export const setTarget = (lngLat, originTargetFC) => {
  return async (dispatch) => {
    const updateOriginTargetFC = updateTargetToFC(originTargetFC, lngLat)
    dispatch({ type: 'SET_TARGET', updateOriginTargetFC })
    dispatch(closePopup())
    const originSet = originTargetFC.features.filter(feat => feat.properties.type === 'origin').length > 0
    if (originSet) {
      const originCoords = utils.getOriginCoordsFromFC(updateOriginTargetFC)
      const targetCoords = utils.getTargetCoordsFromFC(updateOriginTargetFC)
      dispatch(getQuietPaths(originCoords, targetCoords))
    }
  }
}

export const useUserLocationOrigin = (userLocFC) => {
  return async (dispatch) => {
    const userLngLat = turf.getLngLatFromFC(userLocFC)
    dispatch(closePopup())
    if (userLngLat) {
      dispatch({ type: 'SET_ORIGIN_TO_USER_LOC', userLngLat, userLocFC })
    } else {
      dispatch({ type: 'WAIT_FOR_USER_LOC_ORIGIN' })
      dispatch(startTrackingUserLocation())
    }
  }
}

const updateOriginToFC = (FC, lngLat) => {
  const features = FC.features
  const target = features.filter(feat => feat.properties.type === 'target')
  const coords = [lngLat.lng, lngLat.lat]
  const origin = [turf.asPoint(coords, { type: 'origin' })]
  return turf.asFeatureCollection(origin.concat(target))
}

const updateTargetToFC = (FC, lngLat) => {
  const features = FC.features
  const origin = features.filter(feat => feat.properties.type === 'origin')
  const coords = [lngLat.lng, lngLat.lat]
  const target = [turf.asPoint(coords, { type: 'target' })]
  return turf.asFeatureCollection(target.concat(origin))
}

export default pathsReducer
