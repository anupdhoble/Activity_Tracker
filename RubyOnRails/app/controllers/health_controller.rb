# app/controllers/health_controller.rb
class HealthController < ApplicationController
  skip_before_action :authenticate_request
  def check
    render plain: 'OK'
  end
end
