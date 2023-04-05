// import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

// const PLATFORM_lOCATION_PERMISSION = {
//   ios: PERMISSIONS.IOS.CAMERA,
//   android: PERMISSIONS.ANDROID.CAMERA
// }

// const REQUEST_PERMISSION_TYPE = {
//   camera: PLATFORM_lOCATION_PERMISSION
// }

// const PERMISSION_TYPE = {
//   camera: 'camera'
// }

// class AppPermission {

//   checkPermission = async (type) => {
//     const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS]
//     if (!permissions) {
//       return true
//       return this.requestPermission()
//     }
//     try {
//       const result = await check(permissions)
//       if(result === RESULTS.GRANTED) return true
//     } catch (error) {
//       console.log(error)
//       return false
//     }
//   }

//   requestPermission = async (permissions) => {
//     try{
//       const result = await request(permissions)
//       return result === RESULTS.GRANTED
//     } catch (error) {
//       console.log(error)
//       return false
//     }
//   }
// }

// const Permission = new AppPermission()
// export { Permission, PERMISSION_TYPE }