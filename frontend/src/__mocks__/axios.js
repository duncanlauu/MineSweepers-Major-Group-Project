// export default {
//     get: jest.fn().mockResolvedValue({ data: {} })
//   };

// Answer 2  
// const mockAxios = jest.genMockFromModule('axios')

// // this is the key to fix the axios.create() undefined error!
// mockAxios.create = jest.fn(() => mockAxios)

// export default mockAxios


// Answer 3

export default {
    defaults:{
        headers:{
            common:{
                "Content-Type":"",
                "Authorization":""
            }
        }
  },
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
  create: jest.fn(function () {
      return {
          interceptors:{
              request : {  
                  use: jest.fn(() => Promise.resolve({ data: {} })),
              },
              response : {
                use: jest.fn(() => Promise.resolve( {data: {} })),
              }
          },

          defaults:{
                headers:{
                    common:{
                        "Content-Type":"",
                        "Authorization":""
                    }
                }
          },
          get: jest.fn(() => Promise.resolve({ data: {} })),
          post: jest.fn(() => Promise.resolve({ data: {} })),
          put: jest.fn(() => Promise.resolve({ data: {} })),
          delete: jest.fn(() => Promise.resolve({ data: {} })),
      }
  }),
};