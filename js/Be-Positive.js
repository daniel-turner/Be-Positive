BloodType = {

  AB_POS : "AB_POS",
  AB_NEG : "AB_NEG",
  A_POS  : "A_POS",
  A_NEG  : "A_NEG",
  B_POS  : "B_POS",
  B_NEG  : "B_NEG",
  O_POS  : "O_POS",
  O_NEG  : "O_NEG"

};

BloodTransfusionRules = {

  /**
   * Set the simulation speed.
   * @type {Number} : Valid values between 1 and 200
   */
  simulation_speed : 180,

  /**
   * returns BloodType, or false to give no BloodType
   *
   * @name receive_patient
   * @param {Bank} blood_inventory
   * @param {Patient} patient
   * @returns {BloodType or false}
   *
   * Patient properties {
   *   gender : String, (MALE,FEMALE)
   *   blood_type : String (BloodType)
   * }
   *
   * Bank properties {
   *   AB_POS : Integer,
   *   AB_NEG : Integer,
   *   A_POS  : Integer,
   *   A_NEG  : Integer,
   *   B_POS  : Integer,
   *   B_NEG  : Integer,
   *   O_POS  : Integer,
   *   O_NEG  : Integer
   * }
   *
   */

  receive_patient : function (blood_inventory, patient) {

    function getCompatibleTypes(blood_type) {

      var bloodArray = blood_type.split("_");

      var leftCompatible = [];
      var rightCompatible = [];

      if(bloodArray[0].indexOf("A") > -1) {

        leftCompatible = ["A","O"];
      };

      if(bloodArray[0].indexOf("B") > -1) {

        leftCompatible = ["B","O"];
      }

      if(bloodArray[0].indexOf("AB") > -1) { //overrides A and B assignments if applicable

        leftCompatible = ["A","B","AB","O"];
      }

      if(bloodArray[0].indexOf("O") > -1) {

        leftCompatible = ["O"];
      }

      if(bloodArray[1].indexOf("POS") > -1) {

        rightCompatible = ["POS","NEG"];

      } else {

        rightCompatible = ["NEG"];
      }

      var out = [];

      for(var i=0;i<leftCompatible.length;i++) {

        for(var j=0;j<rightCompatible.length;j++) {

          out.push(leftCompatible[i] + "_" + rightCompatible[j]);
        }
      }

      return out;
    };

    function getBestTypes(compatibleTypes,blood_inventory) {

      var oWeight = 1;
      var aWeight = 3;
      var bWeight = 3;
      var abWeight = 7;
      var posWeight = 1;
      var negWeight = 5;

      var out = [];

      for(var i=0;i<compatibleTypes.length;i++) {

        //var index = blood_inventory[compatibleTypes[i]];

        if(blood_inventory.hasOwnProperty(compatibleTypes[i])) {

          var inventoryCount = blood_inventory[compatibleTypes[i]];
          var weight = inventoryCount;

          var bloodArray = compatibleTypes[i].split("_");

          if(bloodArray[0].indexOf("A") > -1) {

            weight = weight * aWeight;
          };

          if(bloodArray[0].indexOf("B") > -1) {

            weight = weight * bWeight;
          }

          if(bloodArray[0].indexOf("AB") > -1) { //overrides A and B assignments if applicable

            weight = weight * abWeight;
          }

          if(bloodArray[0].indexOf("O") > -1) {

            weight = weight * oWeight;
          }

          if(bloodArray[1].indexOf("POS") > -1) {

            weight = weight * posWeight;

          } else {

            weight = weight * negWeight;
          }

          var blood_hit = {

            blood_type: compatibleTypes[i],
            weight: weight
          };

          out.push(blood_hit);
        };
      };
      return out;
    };

    console.log("Incoming blood type: " + patient.blood_type);

    console.log("Compatible types: " + getCompatibleTypes(patient.blood_type));

    console.log(getBestTypes(getCompatibleTypes(patient.blood_type),blood_inventory));

    var compatibleTypes = getCompatibleTypes(patient.blood_type);
    var weightedCompatibilities = getBestTypes(compatibleTypes,blood_inventory);

    if(weightedCompatibilities.length === 0) {

      return null;
    };

    var highestWeight = 0;
    var bestType = "";

    for(var i =0; i<weightedCompatibilities.length;i++) {

      if(weightedCompatibilities[i].weight > highestWeight) {

        bestType = weightedCompatibilities[i].blood_type;
        highestWeight = weightedCompatibilities[i].weight;
      }
    };



    return bestType;
  }

};