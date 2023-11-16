import { inject, injectable } from "tsyringe";

import { IInventoryMagGen } from "@spt-aki/generators/weapongen/IInventoryMagGen";
import { InventoryMagGen } from "@spt-aki/generators/weapongen/InventoryMagGen";
import { BotWeaponGeneratorHelper } from "@spt-aki/helpers/BotWeaponGeneratorHelper";
import { RandomUtil } from "@spt-aki/utils/RandomUtil";

@injectable()
export class BarrelInventoryMagGen implements IInventoryMagGen
{
    constructor(
        @inject("RandomUtil") protected randomUtil: RandomUtil,
        @inject("BotWeaponGeneratorHelper") protected botWeaponGeneratorHelper: BotWeaponGeneratorHelper,
    )
    {}

    getPriority(): number
    {
        return 50;
    }

    canHandleInventoryMagGen(inventoryMagGen: InventoryMagGen): boolean
    {
        return inventoryMagGen.getWeaponTemplate()._props.ReloadMode === "OnlyBarrel";
    }

    process(inventoryMagGen: InventoryMagGen): void
    {
        // Can't be done by _props.ammoType as grenade launcher shoots grenades with ammoType of "buckshot"
        let randomisedAmmoStackSize: number;
        if (inventoryMagGen.getAmmoTemplate()._props.StackMaxRandom === 1)
        { // doesnt stack
            randomisedAmmoStackSize = this.randomUtil.getInt(3, 6);
        }
        else
        {
            randomisedAmmoStackSize = this.randomUtil.getInt(
                inventoryMagGen.getAmmoTemplate()._props.StackMinRandom,
                inventoryMagGen.getAmmoTemplate()._props.StackMaxRandom,
            );
        }

        this.botWeaponGeneratorHelper.addAmmoIntoEquipmentSlots(
            inventoryMagGen.getAmmoTemplate()._id,
            randomisedAmmoStackSize,
            inventoryMagGen.getPmcInventory(),
        );
    }
}
