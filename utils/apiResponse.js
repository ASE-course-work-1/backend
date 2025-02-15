class ApiResponse {
  static success(res, data, message = 'Success') {
    res.status(200).json({ success: true, message, data });
  }

  static created(res, data, message = 'Created') {
    res.status(201).json({ success: true, message, data });
  }

  static badRequest(res, message = 'Bad Request') {
    res.status(400).json({ success: false, message });
  }

  static unauthorized(res, message = 'Unauthorized') {
    res.status(401).json({ success: false, message });
  }

  static forbidden(res, message = 'Forbidden') {
    res.status(403).json({ success: false, message });
  }

  static notFound(res, message = 'Not Found') {
    res.status(404).json({ success: false, message });
  }

  static serverError(res, message = 'Internal Server Error') {
    res.status(500).json({ success: false, message });
  }
}

export default ApiResponse; 