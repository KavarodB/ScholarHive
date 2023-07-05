/**
 * AbstractController class is a generic type of a controller,
 * it is used to implement the O/C principle and should only be extended.
 */
class AbstractController {
	/**
	 * Default checkSigniture function, does not modify or do any specific verification.
	 * It shouldn't be used, it should be overriden for each Controller.
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 */
	checkSigniture(req, res, next) {
		next();
	}
}
export default AbstractController;
