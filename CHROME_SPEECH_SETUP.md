# Chrome Speech Recognition Setup Guide

## Issue: Speech Recognition Not Working on Chrome Linux

If you're seeing "Speech Recognition Not Available" on Chrome 138 on Linux, follow these steps:

## Step 1: Check Chrome Flags

1. Open Chrome and go to: `chrome://flags/`
2. Search for these flags and ensure they are set to **Enabled**:
   - `#enable-experimental-web-platform-features`
   - `#enable-speech-api`
   - `#enable-web-speech-api`

3. After changing flags, restart Chrome completely

## Step 2: Check Microphone Permissions

1. Go to: `chrome://settings/content/microphone`
2. Ensure the site is **Allowed** to access microphone
3. If blocked, click "Allow" and refresh the page

## Step 3: Test Microphone

1. Go to: `chrome://settings/content/microphone`
2. Click "Test microphone"
3. Speak into your microphone and check if the audio level moves

## Step 4: Check HTTPS Requirement

Speech recognition requires HTTPS. The app should be running on:
- `https://localhost:5173` (not `http://localhost:5173`)

## Step 5: Test with Simple HTML File

1. Open the `speech-test.html` file directly in Chrome
2. This will test speech recognition without any framework complications
3. Check the console for detailed error messages

## Step 6: Check System Audio

1. Open System Settings > Sound
2. Check if microphone is detected and working
3. Test microphone in other applications

## Step 7: Chrome Version Check

Ensure you're using Chrome 88+ for Web Speech API support:
```bash
google-chrome --version
```

## Step 8: Alternative Browsers

If Chrome still doesn't work, try:
- **Firefox**: Usually has better speech recognition support on Linux
- **Edge**: Good alternative if available

## Step 9: Debug Information

When testing, check the browser console for:
- Protocol (should be `https:`)
- Speech recognition API availability
- Any error messages

## Common Error Messages and Solutions

### "not-allowed"
- **Cause**: Microphone permission denied
- **Solution**: Allow microphone access in Chrome settings

### "no-speech"
- **Cause**: No audio detected
- **Solution**: Check microphone hardware and system settings

### "network"
- **Cause**: Network connectivity issue
- **Solution**: Check internet connection

### "service-not-allowed"
- **Cause**: Speech recognition service disabled
- **Solution**: Enable Web Speech API in Chrome flags

## Testing Commands

```bash
# Check if Chrome is running on HTTPS
curl -k https://localhost:5173

# Check microphone devices
pactl list short sources

# Test microphone with PulseAudio
parecord --record-time=5 test.wav
```

## Still Not Working?

1. Try opening the app in an incognito window
2. Clear Chrome cache and cookies
3. Restart Chrome completely
4. Check if microphone works in other web applications
5. Try a different microphone if available

## Contact Support

If none of the above works, please provide:
- Chrome version
- Linux distribution and version
- Console error messages
- Microphone hardware details 