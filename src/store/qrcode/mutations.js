/*
* SET STATE for scanning qr code
*/
export function SCAN_QR_CODE(state) {
  state.scanning = true;
}

/*
 * SET STATE cancel scanning
 */
export function CANCEL_SCANNING(state) {
  state.scanning = false;
}

/*
 * SET STATE scanned address
 */
export function SET_SCANNED_ADDRESS(state, payload) {
  state.scannedAddress = payload;
}

/*
 * SET STATE qrMode
 */
export function SCAN_QR_MODE(state, payload) {
  state.qrMode = payload;
}
