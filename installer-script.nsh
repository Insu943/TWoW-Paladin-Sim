!macro customInit
  ; Set the default installation directory to the same location as the installer
  StrCpy $INSTDIR "$EXEDIR\TWoW-Paladin-Simulator-Installed"
!macroend

; Custom installer header to remove version number
!define MUI_PRODUCT "TWoW Paladin Simulator"
!define MUI_VERSION ""

; Override the installer window title
Caption "TWoW Paladin Simulator"

; Add compatibility settings for better Windows security handling
RequestExecutionLevel user
ShowInstDetails show
ShowUnInstDetails show

; Set installer attributes for better compatibility
SetCompressor /SOLID lzma
SetCompressorDictSize 32
SetDatablockOptimize on
SetOverwrite on

; Windows version compatibility
; Compatible with Windows 7 and above
ManifestSupportedOS Win7 Win8 Win8.1 Win10
 