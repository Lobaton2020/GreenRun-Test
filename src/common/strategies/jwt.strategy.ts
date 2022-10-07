// server.auth.strategy('my_jwt_strategy', 'jwt', {
//     keys: 'some_shared_secret',
//     verify: {
//         aud: 'urn:audience:test',
//         iss: 'urn:issuer:test',
//         sub: false,
//         nbf: true,
//         exp: true,
//         maxAgeSec: 14400, // 4 hours
//         timeSkewSec: 15
//     },
//     validate: (artifacts, request, h) => {

//         return {
//             isValid: true,
//             credentials: { user: artifacts.decoded.payload.user }
//         };
//     }
// });

// // Set the strategy

// server.auth.default('my_jwt_strategy');
