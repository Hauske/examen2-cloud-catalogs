import { Router } from "express";
import addressController from "../controllers/addressController";

const router = Router({ mergeParams: true });

router.get('/', addressController.getAllAddressesByClient);
router.get('/:addressId', addressController.getAddressById);
router.post('/', addressController.createAddress);
router.put('/:addressId', addressController.updateAddress);
router.delete('/:addressId', addressController.deleteAddress);

export default router;
