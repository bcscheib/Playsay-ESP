class GuessesController < ApplicationController
  layout 'default'

  def create
    render :json => {} if params[:guess][:body].blank?
    respond_to do |format|
      format.json do
         last_guess_for_photo = @current_user.guesses.where(:matched => true, :photo_src => params[:guess][:photo_src]).last
         last_guess_for_photo_json = {}
         last_guess_for_photo_json = {:body => last_guess_for_photo.body, :matched => last_guess_for_photo.matched} if last_guess_for_photo

         new_guess = @current_user.guesses.create(params[:guess])
         render :json => {:guess => {:body => new_guess.body, :matched => new_guess.matched}, :last_guess => last_guess_for_photo_json}
      end
    end
  end
end