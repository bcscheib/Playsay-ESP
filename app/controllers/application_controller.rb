class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :set_current_user

  private

  def set_current_user
    @current_user = User.find_by_facebook_id(session['facebook_id'])
  end
end
