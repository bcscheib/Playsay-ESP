class UsersController < ApplicationController
  layout 'default'

  #this is the login action
  def new
    @user = User.new
  end

  def create
    if params[:user][:facebook_id].blank?
      render :json => {}
    else
      respond_to do |format|
        format.json do
          user = User.find_or_create_by_facebook_id(params[:user][:facebook_id])
          session['facebook_id'] = params[:user]['facebook_id']
          render :json => user
        end
      end
    end
  end

  #this is the pairing action
  def update
    respond_to do |format|
      format.json do
        if(params[:user][:force_unpair] && params[:user][:force_unpair] == "1")
          @current_user.unpair
        else
          @current_user.pair
        end
        render :json => @current_user.paired_user.as_json
      end
    end
  end
end