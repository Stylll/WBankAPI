const asyncWrapper = func => (request, response, next) => {
    func(request, response, next).catch(next);
};
  
export default asyncWrapper;
