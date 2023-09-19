import { setHideShortsOverlay } from "./HideShortsOverlay"
import { goToNextShort, goToPreviousShort, restartShort } from "./VideoState"
import { setVolume } from "./VolumeSlider"
import { VOLUME_INCREMENT_AMOUNT } from "./declarations"
import { BooleanDictionary, PolyDictionary, StringDictionary } from "./definitions"
import { getVideo } from "./getters"

export function handleKeyEvent( 
  e: KeyboardEvent, 
  features: BooleanDictionary,
  keybinds: StringDictionary,
  settings: any,
  options: PolyDictionary,
  state: any
) { 
  if (
    document.activeElement === document.querySelector(`input`) ||
    document.activeElement === document.querySelector("#contenteditable-root")
    ) return // Avoids using keys while the user interacts with any input, like search and comment.

  if ( features !== null && !features[ "Keybinds" ] ) return
  
  const ytShorts = getVideo()
  if ( !ytShorts ) return
  
  const key    = e.code
  const keyAlt = e.key.toLowerCase() // for legacy keybinds
  
  let command
  for ( const [cmd, keybind] of Object.entries( keybinds as Object ) ) 
    if ( key === keybind || keyAlt === keybind ) 
      command = cmd
  
  if (!command) return

  const volumeSliderEnabled = features !== null && features[ "Volume Slider" ]

  switch (command) {
    case "Seek Backward":
      ytShorts.currentTime -= options?.seek_amount
      break

    case "Seek Forward":
      ytShorts.currentTime += options?.seek_amount
      break

    case "Decrease Speed":
      if (ytShorts.playbackRate > 0.25) ytShorts.playbackRate -= 0.25
      break

    case "Reset Speed":
      ytShorts.playbackRate = 1
      break

    case "Increase Speed":
      if ( ytShorts.playbackRate < 16 ) ytShorts.playbackRate += 0.25
      break

    case "Increase Volume":
      if ( ytShorts.volume < 1 )
        setVolume( settings, ytShorts.volume + VOLUME_INCREMENT_AMOUNT, volumeSliderEnabled )

      if ( ytShorts.volume > 1 )
        ytShorts.volume = 1

      break

    case "Decrease Volume":
      if ( ytShorts.volume > 0 )
        setVolume( settings, ytShorts.volume - VOLUME_INCREMENT_AMOUNT, volumeSliderEnabled )

      if ( ytShorts.volume < 0 )
        ytShorts.volume = 0

      break

    // case "Toggle Mute":
    //   if ( !state.muted ) 
    //   {
    //     state.muted = true
    //     ytShorts.volume = 0
    //     settings.volume = ytShorts.volume
    //   } 
    //   else 
    //   {
    //     state.muted = false
    //     ytShorts.volume = state.volumeState
    //   }
    //   break
      
    case "Next Frame":
      if (ytShorts.paused) {
        ytShorts.currentTime -= 0.04
      }
      break

    case "Previous Frame":
      if (ytShorts.paused) {
        ytShorts.currentTime += 0.04
      }
      break
    
    case "Next Short":
      goToNextShort()
      break

    case "Previous Short":
      goToPreviousShort()
      break

    case "Restart Short":
      restartShort()
      break

    case "Hide Overlay":
      setHideShortsOverlay( !( options?.hide_shorts_overlay ), options );
      break;
  }

  state.playbackRate = ytShorts.playbackRate
}