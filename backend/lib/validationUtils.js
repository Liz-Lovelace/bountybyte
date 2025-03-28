export async function validateWithYup(schema, object) {
  try {
    await schema.validate(object, { abortEarly: false });
    return { success: true };
  } catch (error) {
    if (error.name !== 'ValidationError') {
      throw error;
    }

    const fields = error.inner.reduce((acc, err) => {
      if (!acc[err.path]) {
        acc[err.path] = [];
      }
      acc[err.path].push({
        messageType: 'error',
        text: err.message
      });
      return acc;
    }, {});

    return {
      success: false,
      errors: { fields }
    };
  }
} 

export function isValidationObjectValid(obj) {
  try {
    return obj?.fields && 
           Object.values(obj.fields).every(messages =>
             Array.isArray(messages) &&
             messages.every(msg => 
               typeof msg?.messageType === 'string' && 
               typeof msg?.text === 'string'
             )
           );
  } catch {
    return false;
  }
}