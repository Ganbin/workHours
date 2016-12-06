export function configure(config) {
    config.globalResources(['./elements/filter',
                            './value-converters/millisToHours',
                            './value-converters/minutesToHours',
                            './value-converters/dateFormat',
                            './value-converters/truncate'
                        ]);
}
