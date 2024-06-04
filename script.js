<script>
     fetch('data.json')
            .then(response => response.json())
            .then(data => {
                const conditionSelect = document.getElementById('condition');
                const indicationSelect = document.getElementById('indication');
                const medicineSelect = document.getElementById('medicineName');
                const doseStrengthSelect = document.getElementById('doseStrength');
                const submitButton = document.getElementById('submit');
                const body = document.querySelector('body');



                body.addEventListener('onload', () => {
                    updateIndication();
                    updateMedicine();
                    updateDoseStrength();
                })
                conditionSelect.addEventListener('change', updateIndication);
                indicationSelect.addEventListener('change', updateMedicine);
                medicineSelect.addEventListener('change', updateDoseStrength);
                conditionSelect.addEventListener('click', updateIndication);
                indicationSelect.addEventListener('click', updateMedicine);
                medicineSelect.addEventListener('click', updateDoseStrength);
                submitButton.addEventListener('click', calculateDose);
                function updateIndication() {
                    // const value = data.keys();
                    console.log(value);
                    const condition = conditionSelect.value;
                    const indications = data[condition];
                    console.log(indications);
                    if (indications) {
                        populateSelect(indicationSelect, indications, 'indication');
                        updateMedicine();
                    }
                }

                function updateMedicine() {
                    const condition = conditionSelect.value;
                    const indication = indicationSelect.value;
                    const medicines = data[condition]?.find(item => item.indication === indication);
                    console.log(medicines);
                    if (medicines) {
                        // console.log(medicines);
                        populateSelect(medicineSelect, [medicines], 'drug');
                        updateDoseStrength();
                    }
                }

                function updateDoseStrength() {
                    const condition = conditionSelect.value;
                    const indication = indicationSelect.value;
                    const medicine = medicineSelect.value;
                    const age = parseInt(document.getElementById('age').value);
                    const weight = parseInt(document.getElementById('weight').value);
                    const doseStrengths = data[condition]?.find(item => item.indication === indication && item.drug === medicine);
                    if (doseStrengths) {
                        const doseInMls = doseStrengths.age.find(item => {
                            // console.log(item);
                            const ageRange = item.range.split('-');
                            const weightRange = item.weight.split('-');
                            const ageType = document.getElementById('ageType').value;

                            let minAge, maxAge;
                            if (ageRange[0].includes('>')) {
                                minAge = parseInt(ageRange[0].replace('>', ''));
                                maxAge = Infinity;
                            } else if (ageRange[1] && ageRange[1].includes('<')) {
                                minAge = parseInt(ageRange[0]);
                                maxAge = parseInt(ageRange[1].replace('<', ''));
                            } else {
                                minAge = parseInt(ageRange[0]);
                                maxAge = ageRange[1] ? parseInt(ageRange[1]) : Infinity;
                            }

                            if (ageType === 'months') {
                                minAge *= 12;
                                maxAge *= 12;
                            }

                            const age = parseInt(document.getElementById('age').value);
                            if (ageType === 'months') {
                                minAge /= 12;
                                maxAge /= 12;
                            }


                            let minWeight, maxWeight;
                            if (weightRange[0].includes('>')) {
                                minWeight = parseInt(weightRange[0].replace('>', ''));
                                maxWeight = Infinity;
                            } else if (weightRange[1] && weightRange[1].includes('<')) {
                                minWeight = parseInt(weightRange[0]);
                                maxWeight = parseInt(weightRange[1].replace('<', ''));
                            } else {
                                minWeight = parseInt(weightRange[0]);
                                maxWeight = weightRange[1] ? parseInt(weightRange[1]) : Infinity;
                            }
                            console.log(minAge, maxAge, minWeight, maxWeight, age, weight);
                            return age >= minAge && age <= maxAge && weight >= minWeight && weight <= maxWeight;
                        });
                        console.log(doseInMls);
                        populateSelect(doseStrengthSelect, [doseInMls], 'requiredDose');

                    }
                }

                function populateSelect(selectElement, data, key) {
                    selectElement.innerHTML = '';
                    data.forEach(item => {
                        // console.log(item);
                        const option = document.createElement('option');
                        option.value = item[key];
                        option.textContent = item[key];
                        selectElement.appendChild(option);
                    });
                }

                function calculateDose() {
                    const age = parseInt(document.getElementById('age').value);
                    const weight = parseInt(document.getElementById('weight').value);
                    const condition = document.getElementById('condition').value;
                    const indication = document.getElementById('indication').value;
                    const medicine = document.getElementById('medicineName').value;
                    const doseStrength = document.getElementById('doseStrength').value;
                    console.log(age, weight, indication, medicine, doseStrength, data[condition].filter(condition => condition.indication === indication && condition.drug === medicine));
                    const dose = data[condition].filter(condition => condition.indication === indication && condition.drug === medicine)?.[0].age?.find(item => {
                        console.log(item);
                        const ageRange = item.range.split('-');
                        const weightRange = item.weight.split('-');
                        const ageType = document.getElementById('ageType').value;

                        let minAge, maxAge;
                        if (ageRange[0].includes('>')) {
                            minAge = parseInt(ageRange[0].replace('>', ''));
                            maxAge = Infinity;
                        } else if (ageRange[1] && ageRange[1].includes('<')) {
                            minAge = parseInt(ageRange[0]);
                            maxAge = parseInt(ageRange[1].replace('<', ''));
                        } else {
                            minAge = parseInt(ageRange[0]);
                            maxAge = ageRange[1] ? parseInt(ageRange[1]) : Infinity;
                        }

                        if (ageType === 'months') {
                            minAge *= 12;
                            maxAge *= 12;
                        }

                        const age = parseInt(document.getElementById('age').value);
                        if (ageType === 'months') {
                            minAge /= 12;
                            maxAge /= 12;
                        }


                        let minWeight, maxWeight;
                        if (weightRange[0].includes('>')) {
                            minWeight = parseInt(weightRange[0].replace('>', ''));
                            maxWeight = Infinity;
                        } else if (weightRange[1] && weightRange[1].includes('<')) {
                            minWeight = parseInt(weightRange[0]);
                            maxWeight = parseInt(weightRange[1].replace('<', ''));
                        } else {
                            minWeight = parseInt(weightRange[0]);
                            maxWeight = weightRange[1] ? parseInt(weightRange[1]) : Infinity;
                        }
                        console.log(minAge, maxAge, minWeight, maxWeight, doseStrength);
                        return age >= minAge && age <= maxAge && weight >= minWeight && weight <= maxWeight && item.requiredDose === doseStrength;
                    })?.doseCalculation;

                    if (dose) {
                        const result = `Dose: ${dose}`;
                        document.getElementById('result').textContent = result;
                    } else {
                        document.getElementById('result').textContent = "No dose found for the selected criteria.";
                    }
                }
            })
            .catch(error => console.error(error));
</script>