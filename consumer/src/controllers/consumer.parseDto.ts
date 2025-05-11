export const parseConsumerDTO = (body: any) => {
    return {
      no: body.no,
      name: body.name,
      address: body.address,
      waterMeter: body.waterMeter,
      deleted: false,
    };
  };
  