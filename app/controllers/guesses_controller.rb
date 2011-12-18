class GuessesController < ApplicationController
  layout 'default'

  def create
    render :json => {} if params[:guess][:body].blank?
    respond_to do |format|
      format.json do
         guess = @current_user.guesses.create(params[:guess])
         render :json => guess
      end
    end
  end
end