export function configure(config) {
    config.globalResources(['./elements/navBar',
                            './elements/datePicker',
                            './value-converters/millisToHours',
                            './value-converters/minutesToHours',
                            './value-converters/dateFormat',
                            './value-converters/truncate'
                        ]);
}
