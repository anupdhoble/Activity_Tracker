class ApplicationController < ActionController::Base
  before_action :authenticate_request

  private

  def authenticate_request
    header = request.headers['Authorization']
    if header.present?
      token = header.split(' ').last
      begin
        payload = JWT.decode(token, Rails.application.secret_key_base)[0]
        @current_user = User.find(payload['user_id'])
      rescue JWT::DecodeError
        render json: { error: 'Invalid token' }, status: :unauthorized
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'User not found' }, status: :unauthorized
      end
    else
      render json: { error: 'Authorization header missing' }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end
end
